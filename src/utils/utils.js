export function getTimestamp() {
  return Date.now();
}

export function getCreatorDetails(userRole, id) {
  if (userRole === process.env.REACT_APP_ADMIN_ROLE) {
    return {
      userRole: userRole,
      admin: id,
    };
  } else if (userRole === process.env.REACT_APP_HEALTH_PROFESSIONAL_ROLE) {
    return {
      userRole: userRole,
      user: id,
    };
  }
}
export function getLastEditorDetails(userRole, id) {
  if (userRole === process.env.REACT_APP_ADMIN_ROLE) {
    return {
      userRole: userRole,
      admin: id,
    };
  } else if (userRole === process.env.REACT_APP_HEALTH_PROFESSIONAL_ROLE) {
    return {
      userRole: userRole,
      user: id,
    };
  }
}
