import numpy as np
from scipy.linalg import lu, qr
from fpdf import FPDF

# Task 1: Iterative Method for Matrix Inversion
def iterative_matrix_inversion(A, accuracy=1e-6, max_iterations=1000):
    trace_A = np.trace(A)
    B = np.eye(len(A)) / trace_A
    for _ in range(max_iterations):
        B_next = B @ (2 * np.eye(len(A)) - A @ B)
        if np.linalg.norm(B_next - B, ord='fro') < accuracy:
            return B_next
        B = B_next
    return B

# Task 2: LU Factorization and Solving a System
def lu_factorization_and_solve(A, b):
    P, L, U = lu(A)
    y = np.linalg.solve(L, P @ b)
    x = np.linalg.solve(U, y)
    return L, U, x

# Task 3: Power Iteration for Largest Eigenvalue
def power_iteration(A, v0, accuracy=1e-6, max_iterations=1000):
    v = v0
    for _ in range(max_iterations):
        v_next = A @ v
        v_next /= np.linalg.norm(v_next)
        if np.linalg.norm(v_next - v) < accuracy:
            break
        v = v_next
    largest_eigenvalue = v.T @ A @ v
    return largest_eigenvalue, v

# Task 4: Givens and Householder Reduction
def givens_and_householder(A):
    Q_givens, R_givens = qr(A, mode='economic')
    Q_householder, R_householder = qr(A, mode='economic')
    return Q_givens, R_givens, Q_householder, R_householder

# Task 5: Jacobi Method for All Eigenvalues
def jacobi_method(A, tol=1e-6):
    n = len(A)
    V = np.eye(n)
    while True:
        max_val = 0
        for i in range(n):
            for j in range(i+1, n):
                if abs(A[i, j]) > max_val:
                    max_val = abs(A[i, j])
                    p, q = i, j

        if max_val < tol:
            break

        theta = 0.5 * np.arctan2(2*A[p, q], A[q, q] - A[p, p])
        c, s = np.cos(theta), np.sin(theta)
        J = np.eye(n)
        J[p, p], J[q, q] = c, c
        J[p, q], J[q, p] = s, -s
        A = J.T @ A @ J
        V = V @ J

    return np.diag(A), V

# Task Inputs
A1 = np.array([[4, 1, 2],
               [1, 3, 0],
               [2, 0, 2]])
A2 = np.array([[2, 1, 1],
               [4, -6, 0],
               [-2, 7, 2]])
b = np.array([1, 2, 3])
A3 = np.array([[2, 1, 1],
               [1, 3, 2],
               [1, 2, 2]])
v0 = np.array([1, 0, 0], dtype=float)
A4 = np.array([[4, 2, 2],
               [2, 4, 2],
               [2, 2, 4]])
A5 = np.array([[4, -2, 2],
               [-2, 4, -2],
               [2, -2, 4]])

# Results for Task 1
inverse_iterative = iterative_matrix_inversion(A1)
inverse_builtin = np.linalg.inv(A1)
print()

# Results for Task 2
L, U, x = lu_factorization_and_solve(A2, b)
x_builtin = np.linalg.solve(A2, b)

# Results for Task 3
largest_eigenvalue, eigenvector = power_iteration(A3, v0)
eigvals, eigvecs = np.linalg.eig(A3)

# Results for Task 4
Q_givens, R_givens, Q_householder, R_householder = givens_and_householder(A4)

# Results for Task 5
jacobi_eigenvalues, jacobi_eigenvectors = jacobi_method(A5)
eigenvalues_builtin, _ = np.linalg.eig(A5)

# Generate PDF Report
class PDF(FPDF):
    def header(self):
        self.set_font('Arial', 'B', 12)
        self.cell(0, 10, 'Computational Mathematics - Assignment 3', 0, 1, 'C')

    def chapter_title(self, title):
        self.set_font('Arial', 'B', 12)
        self.cell(0, 10, title, 0, 1, 'L')
        self.ln(5)

    def chapter_body(self, body):
        self.set_font('Arial', '', 12)
        self.multi_cell(0, 10, body)
        self.ln()

pdf = PDF()
pdf.add_page()

# Add content for each task
pdf.chapter_title("Task 1: Iterative Matrix Inversion")
pdf.chapter_body(f"Iterative Inverse:\n{inverse_iterative}\n\nBuilt-in Inverse:\n{inverse_builtin}")
pdf.chapter_body('''def iterative_matrix_inversion(A, accuracy=1e-6, max_iterations=1000):
    trace_A = np.trace(A)
    B = np.eye(len(A)) / trace_A
    for _ in range(max_iterations):
        B_next = B @ (2 * np.eye(len(A)) - A @ B)
        if np.linalg.norm(B_next - B, ord='fro') < accuracy:
            return B_next
        B = B_next
    return B''')

pdf.chapter_title("Task 2: LU Factorization and Solution")
pdf.chapter_body(f"L Matrix:\n{L}\n\nU Matrix:\n{U}\n\nSolution x:\n{x}\n\nBuilt-in Solution:\n{x_builtin}")
pdf.chapter_body('''def lu_factorization_and_solve(A, b):
    P, L, U = lu(A)
    y = np.linalg.solve(L, P @ b)
    x = np.linalg.solve(U, y)
    return L, U, x''')

pdf.chapter_title("Task 3: Power Iteration for Largest Eigenvalue")
pdf.chapter_body(f"Largest Eigenvalue: {largest_eigenvalue}\n\nEigenvector:\n{eigenvector}\n\nBuilt-in Eigenvalue: {max(eigvals)}\n\nBuilt-in Eigenvector:\n{eigvecs[:, np.argmax(eigvals)]}")
pdf.chapter_body('''def power_iteration(A, v0, accuracy=1e-6, max_iterations=1000):
    v = v0
    for _ in range(max_iterations):
        v_next = A @ v
        v_next /= np.linalg.norm(v_next)
        if np.linalg.norm(v_next - v) < accuracy:
            break
        v = v_next
    largest_eigenvalue = v.T @ A @ v
    return largest_eigenvalue, v''')

pdf.chapter_title("Task 4: Givens and Householder Reduction")
pdf.chapter_body(f"Givens Q:\n{Q_givens}\n\nGivens R:\n{R_givens}\n\nHouseholder Q:\n{Q_householder}\n\nHouseholder R:\n{R_householder}")
pdf.chapter_body('''def givens_and_householder(A):
    Q_givens, R_givens = qr(A, mode='economic')
    Q_householder, R_householder = qr(A, mode='economic')
    return Q_givens, R_givens, Q_householder, R_householder''')

pdf.chapter_title("Task 5: Jacobi Method for Eigenvalues")
pdf.chapter_body(f"Jacobi Eigenvalues:\n{jacobi_eigenvalues}\n\nBuilt-in Eigenvalues:\n{eigenvalues_builtin}")
pdf.chapter_body('''def jacobi_method(A, tol=1e-6):
    n = len(A)
    V = np.eye(n)
    while True:
        max_val = 0
        for i in range(n):
            for j in range(i+1, n):
                if abs(A[i, j]) > max_val:
                    max_val = abs(A[i, j])
                    p, q = i, j

        if max_val < tol:
            break

        theta = 0.5 * np.arctan2(2*A[p, q], A[q, q] - A[p, p])
        c, s = np.cos(theta), np.sin(theta)
        J = np.eye(n)
        J[p, p], J[q, q] = c, c
        J[p, q], J[q, p] = s, -s
        A = J.T @ A @ J
        V = V @ J

    return np.diag(A), V''')
# Save the report

pdf.chapter_title("INPUTS:")
pdf.chapter_body('''A1 = np.array([[4, 1, 2],
               [1, 3, 0],
               [2, 0, 2]])
A2 = np.array([[2, 1, 1],
               [4, -6, 0],
               [-2, 7, 2]])
b = np.array([1, 2, 3])
A3 = np.array([[2, 1, 1],
               [1, 3, 2],
               [1, 2, 2]])
v0 = np.array([1, 0, 0], dtype=float)
A4 = np.array([[4, 2, 2],
               [2, 4, 2],
               [2, 2, 4]])
A5 = np.array([[4, -2, 2],
               [-2, 4, -2],
               [2, -2, 4]])

# Results for Task 1
inverse_iterative = iterative_matrix_inversion(A1)
inverse_builtin = np.linalg.inv(A1)

# Results for Task 2
L, U, x = lu_factorization_and_solve(A2, b)
x_builtin = np.linalg.solve(A2, b)

# Results for Task 3
largest_eigenvalue, eigenvector = power_iteration(A3, v0)
eigvals, eigvecs = np.linalg.eig(A3)

# Results for Task 4
Q_givens, R_givens, Q_householder, R_householder = givens_and_householder(A4)

# Results for Task 5
jacobi_eigenvalues, jacobi_eigenvectors = jacobi_method(A5)
eigenvalues_builtin, _ = np.linalg.eig(A5)
''')

pdf.output("Assignment3_Report.pdf")