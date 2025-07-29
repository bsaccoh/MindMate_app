export const getFirebaseErrorMessage = (error: any): string => {
  switch (error.code) {
    case 'auth/email-already-in-use':
      return 'Email already in use';
    case 'auth/invalid-email':
      return 'Invalid email address';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters';
    case 'auth/user-disabled':
      return 'This account has been disabled';
    case 'auth/user-not-found':
      return 'Account not found';
    case 'auth/wrong-password':
      return 'Incorrect password';
    case 'auth/too-many-requests':
      return 'Too many attempts. Try again later';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection';
    case 'auth/operation-not-allowed':
      return 'Operation not allowed';
    default:
      console.error('Firebase error:', error.code, error.message);
      return 'An unexpected error occurred. Please try again';
  }
};