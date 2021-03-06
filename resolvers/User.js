module.exports = serviceContext => {
    const queryMap = {
        folders: (root, args) => {
            console.log(root);
            return serviceContext.dal.getFolderByUserId(root.id);
        },
    }
    return queryMap;
}