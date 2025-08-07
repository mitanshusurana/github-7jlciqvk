import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { User } from '../types';

type Role = User['role'];

const withRole = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  allowedRoles: Role[]
) => {
  const ComponentWithRole: React.FC<P> = (props) => {
    const { user } = useAuth();

    if (!user || !allowedRoles.includes(user.role)) {
      return <div>You do not have permission to view this page.</div>;
    }

    return <WrappedComponent {...props} />;
  };

  return ComponentWithRole;
};

export default withRole;
