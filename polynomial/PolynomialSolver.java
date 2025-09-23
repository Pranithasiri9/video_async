import org.json.JSONObject;
import java.util.*;

public class PolynomialSolver {

    // Method to convert a value from given base to decimal
    public static long decodeValue(String base, String value) {
        int baseInt = Integer.parseInt(base);
        return Long.parseLong(value, baseInt);
    }

    // Method to solve system of linear equations using Gaussian elimination
    public static double[] solveLinearSystem(double[][] matrix, double[] constants) {
        int n = matrix.length;

        // Forward elimination
        for (int i = 0; i < n; i++) {
            // Find pivot
            int maxRow = i;
            for (int k = i + 1; k < n; k++) {
                if (Math.abs(matrix[k][i]) > Math.abs(matrix[maxRow][i])) {
                    maxRow = k;
                }
            }

            // Swap rows
            double[] temp = matrix[i];
            matrix[i] = matrix[maxRow];
            matrix[maxRow] = temp;

            double tempConst = constants[i];
            constants[i] = constants[maxRow];
            constants[maxRow] = tempConst;

            // Make all rows below this one 0 in current column
            for (int k = i + 1; k < n; k++) {
                double factor = matrix[k][i] / matrix[i][i];
                constants[k] -= factor * constants[i];
                for (int j = i; j < n; j++) {
                    matrix[k][j] -= factor * matrix[i][j];
                }
            }
        }

        // Back substitution
        double[] solution = new double[n];
        for (int i = n - 1; i >= 0; i--) {
            solution[i] = constants[i];
            for (int j = i + 1; j < n; j++) {
                solution[i] -= matrix[i][j] * solution[j];
            }
            solution[i] /= matrix[i][i];
        }

        return solution;
    }

    // Method to find polynomial coefficients using interpolation
    public static double[] findPolynomialCoefficients(List<Point> points) {
        int n = points.size();

        // Create Vandermonde matrix
        double[][] matrix = new double[n][n];
        double[] constants = new double[n];

        for (int i = 0; i < n; i++) {
            double x = points.get(i).x;
            constants[i] = points.get(i).y;

            for (int j = 0; j < n; j++) {
                matrix[i][j] = Math.pow(x, j);
            }
        }

        return solveLinearSystem(matrix, constants);
    }

    // Helper class to store (x, y) points
    static class Point {
        double x, y;

        Point(double x, double y) {
            this.x = x;
            this.y = y;
        }

        @Override
        public String toString() {
            return "(" + x + ", " + y + ")";
        }
    }

    public static long solve(String jsonString) {
        // Step 1: Parse JSON data
        JSONObject jsonData = new JSONObject(jsonString);
        JSONObject keys = jsonData.getJSONObject("keys");

        int n = keys.getInt("n");
        int k = keys.getInt("k");

        System.out.println("n (number of roots): " + n);
        System.out.println("k (minimum roots needed): " + k);

        // Step 2: Convert base values to (x, y) coordinates
        List<Point> points = new ArrayList<>();

        for (String key : jsonData.keySet()) {
            if (!key.equals("keys")) {
                JSONObject root = jsonData.getJSONObject(key);
                double x = Double.parseDouble(key);
                String base = root.getString("base");
                String value = root.getString("value");
                double y = decodeValue(base, value);

                points.add(new Point(x, y));
                System.out.println("Point: x=" + (int) x + ", y=" + (int) y +
                        " (converted from base " + base + " value '" + value + "')");
            }
        }

        // Sort points by x value for consistency
        points.sort((p1, p2) -> Double.compare(p1.x, p2.x));

        // Step 3: Use interpolation to find coefficients
        List<Point> pointsNeeded = points.subList(0, k);
        System.out.println("\nUsing " + k + " points for interpolation: " + pointsNeeded);

        double[] coefficients = findPolynomialCoefficients(pointsNeeded);

        System.out.print("\nPolynomial coefficients: [");
        for (int i = 0; i < coefficients.length; i++) {
            System.out.print(String.format("%.0f", coefficients[i]));
            if (i < coefficients.length - 1)
                System.out.print(", ");
        }
        System.out.println("]");

        System.out.print("Polynomial: " + String.format("%.0f", coefficients[0]));
        for (int i = 1; i < coefficients.length; i++) {
            if (coefficients[i] >= 0) {
                System.out.print(" + " + String.format("%.0f", coefficients[i]) + "x^" + i);
            } else {
                System.out.print(" - " + String.format("%.0f", Math.abs(coefficients[i])) + "x^" + i);
            }
        }
        System.out.println();

        // Step 4: Return only c value (constant term)
        long cValue = Math.round(coefficients[0]);
        System.out.println("\nC value (constant term): " + cValue);
        return cValue;
    }

    public static void main(String[] args) {
        // Sample test case
        String sampleJson = "{" +
                "\"keys\": {" +
                "\"n\": 4," +
                "\"k\": 3" +
                "}," +
                "\"1\": {" +
                "\"base\": \"10\"," +
                "\"value\": \"4\"" +
                "}," +
                "\"2\": {" +
                "\"base\": \"2\"," +
                "\"value\": \"111\"" +
                "}," +
                "\"3\": {" +
                "\"base\": \"10\"," +
                "\"value\": \"12\"" +
                "}," +
                "\"6\": {" +
                "\"base\": \"4\"," +
                "\"value\": \"213\"" +
                "}" +
                "}";

        System.out.println("=== Polynomial Coefficient Finder ===");
        long result = solve(sampleJson);
        System.out.println("\n=== FINAL ANSWER: " + result + " ===");
    }
}
