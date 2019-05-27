module.exports = serviceContext => {
  const queryMap = {
    user: (root, args) => {
      return serviceContext.dal.getUserById(args.id);
    },
    users: (root, args) => {
      return serviceContext.dal.getAllUsers();
    },
    folder: (root, args) => {
      return serviceContext.dal.getFolderById(args.id);
    },
    folders: (root, args) => {
      return serviceContext.dal.getAllFolders();
    },
  }

  return queryMap;
}