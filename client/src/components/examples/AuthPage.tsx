import AuthPage from '../AuthPage';

export default function AuthPageExample() {
  return <AuthPage onSuccess={(user) => {
    console.log('Auth success:', user);
  }} />;
}
