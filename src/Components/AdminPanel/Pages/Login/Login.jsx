import React from 'react'; // Keep React import

export default function Login() {
  // All previous hooks, state, handlers, and complex JSX are temporarily removed.
  return (
    <div style={{ padding: '20px', backgroundColor: 'lightyellow', border: '1px solid red', textAlign: 'center' }}>
      <h1>Login Page Test</h1>
      <p>If you see this, the Login component is being rendered by the router at the /login-test path.</p>
      <p>This confirms the simplified router is working and can render this specific component.</p>
    </div>
  );
}
