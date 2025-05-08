module.exports = (sequelize, DataTypes) => {
    const HomeDetail = sequelize.define ('HomeDetail', {
        participant_email: {
            type: DataTypes.STRING(255),
            primaryKey: true,
            allowNull: false
        },
        country: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: { notEmpty: { msg: 'Contry must not be empty'}}
        },
        city: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: { notEmpty: { msg: 'City must not be empty'}}
        }
    },
    {
        tableName: 'home_details',
        underscored: true,
        timestamps: true
      }
    );
  
    HomeDetail.associate = (db) => {
      db.HomeDetail.belongsTo(db.Participant, {
        foreignKey: 'participant_email',
        as: 'participant'
      });
    };
  
    return HomeDetail;
  };
  