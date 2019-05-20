module.exports = serviceContext => {
  const queryMap = {
    user: () => {
      return {
        id: '123',
        firstName: 'Thang',
        lastName: 'Nguyen'
      }
    }
  }

  return queryMap;
}