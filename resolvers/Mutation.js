module.exports = serviceContext => {
    const Mutation = {
        createUser: (_, args) => {
            return serviceContext.dal.createUser(args.input);
        },
        updateUser: (_, args) => {
            return serviceContext.dal.updateUser(args.input);
        },
        deleteUser: (_, args) => {
            return serviceContext.dal.deleteUser(args.id);
        },
        createFolder: (_, args) => {
            return serviceContext.dal.createFolder(args.input);
        },
        updateFolder: (_, args) => {
            return serviceContext.dal.updateFolder(args.input);
        },
        deleteFolder: (_, args) => {
            return serviceContext.dal.deleteFolder(args.id);
        },
    }

    return Mutation;
}