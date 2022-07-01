// Possible special permissions:
export const PM_CREATE_USER = "CREATE_USER";
export const PM_UPDATE_USER = "UPDATE_USER";
export const PM_DELETE_USER = "DELETE_USER";
export const PM_LIST_ALL_USER = "LIST_ALL_USER";

export const USER_SPECIAL_PERMISSIONS: Record<string, Array<string>> = {
  ADMIN: [PM_CREATE_USER, PM_UPDATE_USER, PM_DELETE_USER, PM_LIST_ALL_USER],
  DEFAULT: [],
};

export const checkPermission = (
  typeUser: string,
  permission: string
): boolean => {
  return USER_SPECIAL_PERMISSIONS[typeUser]?.includes(permission);
};
