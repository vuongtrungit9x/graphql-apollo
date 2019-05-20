module.exports = serviceContext => {
  async function getUsers(context, args) {
    //implement sql here
    return [{
      id: 'uuid1'
    }, { id: 'uuid2' }];
  }

  return { 
    getUsers
  }
}