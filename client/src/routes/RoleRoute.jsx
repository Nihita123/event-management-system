const RoleRoute = ({ children, allowedRoles }) => {
  const { user } = useContext(AuthContext);
  if (!user || !allowedRoles.includes(user.role)) return <Navigate to="/" />;
  return children;
};
