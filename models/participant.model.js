module.exports = (sequelize, DataTypes) => {
    const Participant = sequelize.define('Participant', 
        {
        email: {
            type: DataTypes.STRING(255),
            primaryKey: true,
            allowNull: false,
            validate: {
                isEmail: {
                  msg: 'Must be a valid email adress'
                }
                
            }
        },
        firstName: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                len: {
                    args: [1,100],
                    msg: 'First name must be between 1 and 100 characters'
                }
            }
        },
        lasName: {
            type: DataTypes.STRING(100),
            allowNnull: false,
            validate: {
                len: {
                    args: [1,100],
                    msg: 'Last name must be between 1 and 100 characters '
                }
            }

        },
        dob: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            validate: {
                isDate: {
                    msg: 'Date of birth must be in YYYY-MM-DD format'
                }
            }
        }
    },
        {
            tableName: 'participants',
            underscore: true,
            timestamp: true
        }
    );


    Participant.associate = (db) => {
        db.Participant.hasOne(db.WorkDetail, {
          foreignKey: 'participant_email',
          as: 'workDetails'
        });
        db.Participant.hasOne(db.HomeDetail, {
          foreignKey: 'participant_email',
          as: 'homeDetails'
        });
      };
    
      return Participant;
    };