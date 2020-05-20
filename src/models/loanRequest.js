export default (sequelize, DataTypes) => {
    const LoanRequest = sequelize.define('LoanRequest', {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_uuid: DataTypes.UUID,
    amount:DataTypes.STRING,
    email: DataTypes.STRING,
    bank: DataTypes.STRING,
    accountName: DataTypes.STRING,
    accountNumber:DataTypes.STRING,
    confirmed:DataTypes.BOOLEAN
    });
    // LoanRequest.associate = () => {
    //   // associations can be defined here
    // };
    return LoanRequest;
  };
  