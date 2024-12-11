import React from 'react';
import useAuthContext from '../../hooks/useAuthContext';

interface PermissionGateProps {
  requiredPermissions: string[];
  matchAllPermissions?: boolean;
  children: React.ReactNode;
}

export const checkPermissions = (
  requiredPermissions: string[],
  userPermissions: string[],
  matchAllPermissions = true,
): boolean =>
  matchAllPermissions
    ? requiredPermissions.every((permission) =>
        userPermissions.includes(permission),
      )
    : requiredPermissions.some((permission) =>
        userPermissions.includes(permission),
      );

const PermissionGate = ({
  requiredPermissions,
  matchAllPermissions = true,
  children,
}: PermissionGateProps) => {
  const { getUserDetails } = useAuthContext();
  const userDetails = getUserDetails();

  if (!userDetails) {
    return null;
  }

  const userPermissions: string[] = userDetails.permissions;

  const hasPermissions = checkPermissions(
    requiredPermissions,
    userPermissions,
    matchAllPermissions,
  );

  return hasPermissions ? <>{children}</> : null;
};

export default PermissionGate;
