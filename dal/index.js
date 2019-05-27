const humps = require('humps');

module.exports = (serviceContext) => {
  const client = serviceContext.dbConnections.postgres.read;
  return {
    getUserById(userId) {
      return client.query(`
        SELECT user_id as id, first_name, last_name, email, user_name, status_id
        FROM sso_user
        WHERE user_id = $1
      `, [userId]).then(res => {
        const data = humps.camelizeKeys(res[0]);
        return data;
      });
    },
    getAllUsers() {
      return client.query(`
        SELECT user_id as id, first_name, last_name, email, user_name, status_id
        FROM sso_user
      `).then(res => {
        const data = humps.camelizeKeys(res);
        return data;
      });
    },
    getFolderById(id) {
      return client.query(`
        SELECT id, name, description, parent_id, status_id, user_id FROM folder
        WHERE id = $1
      `, [id]).then(res => {
        const data = humps.camelizeKeys(res[0]);
        return data;
      });
    },
    getFolderByUserId(userId) {
      return client.query(`
        SELECT id, name, description, parent_id, status_id, user_id FROM folder
        WHERE user_id = $1
      `, [userId]).then(res => {
        const data = humps.camelizeKeys(res);
        return data;
      });
    },
    getAllFolders() {
      return client.query(`
        SELECT id, name, description, parent_id, status_id, user_id FROM folder
      `).then(res => {
        const data = humps.camelizeKeys(res);
        return data;
      });
    },
    createUser({
      firstName,
      lastName,
      email,
      userName,
      status
    }) {
      // console.log(status);
      return client.query(`
      INSERT into sso_user(first_name, last_name, email, user_name, status_id, password)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING user_id as id, first_name, last_name, email, user_name, status_id, password
    `, [firstName, lastName, email, userName, 1, 'password']).then(res => {
        const data = humps.camelizeKeys(res[0]);
        return data;
      });
    },
    updateUser({
      id,
      firstName,
      lastName,
      status
    }) {
      // console.log(status);
      return client.query(`
      UPDATE public.sso_user
      SET first_name=$2, last_name=$3, status_id=$4
      WHERE user_id=$1
      RETURNING user_id as id, first_name, last_name, email, user_name, status_id, password
    `, [id, firstName, lastName, 1]).then(res => {
        return humps.camelizeKeys(res[0]);
      });
    },
    deleteUser(
      id
    ) {
      // console.log(status);
      return client.query(`
      DELETE FROM public.sso_user
      WHERE user_id=$1
    `, [id]).then(res => {
        return {
          id: id,
          message: "Delete success!"
        }
      }).catch(err => {
        return {
          id: id,
          message: err.message
        }
      });
    },
    createFolder({
      name,
      description,
      thumbnailUrl,
      parentId,
      userId,
      status
    }) {
      // console.log(status);
      return client.query(`
      INSERT into folder(name, description, thumbnail_url, parent_id,user_id, status_id )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, name, description, thumbnail_url, parent_id, status_id, user_id
    `, [name, description, thumbnailUrl, parentId, userId, 1]).then(res => {
        return humps.camelizeKeys(res);
      });
    },
    updateFolder({
      id,
      name,
      description,
      thumbnailUrl,
      status
    }) {
      // console.log(status);
      return client.query(`
      UPDATE public.folder
      SET name=$2, description=$3, thumbnail_url=$4, status_id=$5
      WHERE id=$1
      RETURNING id, name, description, thumbnail_url, parent_id, status_id, user_id
    `, [id, name, description, thumbnailUrl, 1]).then(res => {
        return humps.camelizeKeys(res);
      });
    },
    deleteFolder(
      id
    ) {
      // console.log(status);
      return client.query(`
      DELETE FROM public.folder
      WHERE user_id=$1
    `, [id]).then(res => {
        return {
          id: id,
          message: "Delete success!"
        }
      }).catch(err => {
        return {
          id: id,
          message: err.message
        }
      });
    },

  }

}