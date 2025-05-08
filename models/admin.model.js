module.exports = (sequelize, DataTypes) => {
    const Admin = sequelize.define('Admin', {
        username: {
            type: DataTypes.STRING(50),
            primaryKey: true, 
            allowNull: false,
            validate: {
                len: { args: [3,50], msg: 'Username must be 3-50 chars'}
            }
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                len: { args: [6,100], msg: 'Password must be at least 6 chars'}
            }
        }
      },
      {
        tableName: 'admins',
        underscored: true,
        timestamps: true
      }
    );
    return Admin;
  };