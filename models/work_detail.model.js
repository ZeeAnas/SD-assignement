module.exports = (sequelize, DataTypes) => {
    const WorkDetail = sequelize.define('WorkDetail', 
        {
            participant_email: {
                type: DataTypes.STRING(255),
                primaryKey: true,
                allowNull: false
            },
            companyname : {
                type: DataTypes.STRING(255),
                allowNull: false,
                validate: { leng: { args: [1, 255], msg: 'Company name must not be empty'} }
            },
            salary: {
                type: DataTypes.DECIMAL(15,2),
                allowNull: false,
                validate: {
                    isDecimal: {msg: 'Salary must be a decimal number'},
                    min: { args: [0], msg: 'Salary must be zero or positive' }
                }
            },
            currency: {
                type: DataTypes.STRING(10),
                allowNull: false,
                validate: { notEmpty: { msg: 'Currency must not be empty'}}
            }
        },
        {
            tableName: 'work_details',
            underscore: true,
            timestamps: true
        }
    );
    WorkDetail.associate = (db) => {
        db.WorkDetail.belongsTo(db.Participant, {
            foreignKey: 'participant_email',
            as: 'participant'
        });
    };
    return WorkDetail; 
}