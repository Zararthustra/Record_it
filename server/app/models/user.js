module.exports = (sequelize, Sequelize) => {

    const User = sequelize.define("user", {
  
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      }
    });
  
    return User;
  };