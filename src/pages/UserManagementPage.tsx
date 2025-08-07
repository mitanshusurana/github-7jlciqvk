import React from 'react';

const UserManagementPage: React.FC = () => {
  return (
    <div className="container-page">
      <h1 className="text-3xl font-bold text-neutral-900">User Management</h1>
      <p className="mt-1 text-neutral-500">
        This page is only accessible to admins.
      </p>
    </div>
  );
};

export default UserManagementPage;
