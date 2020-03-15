/* eslint-disable max-len */
import Sequelize, {
  Op, fn, col, and,
} from 'sequelize';


const helperMethods = {
  async searchWithCategoryAndLocation(point,
    category_uuid,
    Service) {
    const service = await Service.findAll({
      where: {
        [Op.and]: [Sequelize.where(
          Sequelize.fn('ST_DWithin',
            Sequelize.col('location'),
            Sequelize.fn('ST_SetSRID',
              Sequelize.fn('ST_MakePoint',
                point.coordinates[0], point.coordinates[1]),
              4326),
            0.032),
          true,
        ), { category_uuid: category_uuid.dataValues.uuid }],
      },
      attributes: {
        exclude: ['password', 'createdAt', 'updatedAt'],
      },
      order: [
        ['createdAt', 'DESC'],
      ],
    });
    return service;
  },

  // search without category
  async searchWithLocation(point,
    Service) {
    const service = await Service.findAll({
      where: Sequelize.where(
        Sequelize.fn('ST_DWithin',
          Sequelize.col('location'),
          Sequelize.fn('ST_SetSRID',
            Sequelize.fn('ST_MakePoint',
              point.coordinates[0], point.coordinates[1]),
            4326),
          0.032),
        true,
      ),
      attributes: {
        exclude: ['password', 'createdAt', 'updatedAt'],
      },
      order: [
        ['createdAt', 'DESC'],
      ],
    });
    return service;
  },
  async searchWithCategoty(
    category_uuid,
    Service,
  ) {
    const service = await Service.findAll({
      where: {
        category_uuid: category_uuid.dataValues.uuid,
      },
      attributes: {
        exclude: ['password', 'createdAt', 'updatedAt'],
      },
      order: [
        ['createdAt', 'DESC'],
      ],
    });
    return service;
  },
  async search(
    input,
    Service,
  ) {
    const service = await Service.findAll({
      where: {
        [Op.or]: [
          {
            service: {
              [Op.iLike]: `%${input}%`,
            },
          },
        ],
      },
      attributes: {
        exclude: ['password', 'createdAt', 'updatedAt'],
      },
      order: [
        ['createdAt', 'DESC'],
      ],
    });
    return service;
  },
  // find a wallet by the user id
  async findAWalletByUser(Wallet, uuid, exclude = ['refrence_id']) {
    const wallet = await Wallet.findOne({
      where: { user_uuid: uuid },
      attributes: { exclude },
    });
    return wallet;
  },

  // find a wallet by the uuid of the wallet
  async findAWalletByUuid(Wallet, uuid, exclude = ['refrence_id']) {
    const wallet = await Wallet.findOne({
      where: { uuid },
      attributes: { exclude },
    });
    return wallet;
  },

  // update a user's wallet
  async updateAUsersWallet(Wallet, balance, user_uuid) {
    await Wallet.update(
      { balance },
      { where: { user_uuid } },
    );
  },
  // find a particular charge by id
  async findAChargeByUuid(Charge, uuid) {
    const charge = await Charge.findOne({
      where: { uuid },
    });
    return charge;
  },
  // create a transaction object
  createTransaction(
    user_uuid,
    wallet_id,
    recipient_id,
    job_uuid,
    transaction_type,
    purpose,
    status = '',
    balance = 0,
    amount = 0,
  ) {
    return {
      user_uuid,
      wallet_id,
      recipient_id,
      job_uuid,
      transaction_type,
      purpose,
      status,
      balance,
      amount,
    };
  },

  // find a user by uuid
  async getAUser(User, uuid, exclude) {
    const user = await User.findOne({
      where: { uuid },
      attributes: {
        exclude,
      },
    });
    return user;
  },
  // find a job by uuid
  async findJobByUuid(Job, uuid, exclude) {
    const job = await Job.findOne({
      where: { uuid },
      attributes: {
        exclude,
      },
    });
    return job;
  },
  // get a users socket id
  async findSocketId(Token, user_uuid) {
    const professionalToken = await Token.findOne({
      where: { user_uuid },
      attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
    });
    return professionalToken;
  },
  // delete a stock
  async deleteStock(table, item_uuid, professional_uuid) {
    await table.destroy({
      where: { uuid: item_uuid, professional_uuid },
    });
  },
  // like a stock
  async likeStock(table, item_uuid) {
    const likedVideo = await table.update(
      {
        likes: +1,
      },
      {
        returning: true,
        where: { uuid: item_uuid },
      },
    );
    return likedVideo;
  },
  // search for a stock
  async searchStock(table, input) {
    const stocks = await table.findAll({
      where: {
        [Op.or]: [{ professional_name: { [Op.iLike]: `%${input}%` } },
          { category: { [Op.iLike]: `%${input}%` } },
          { title: { [Op.iLike]: `%${input}%` } }],
      },
      order: [
        ['createdAt', 'DESC'],
      ],
      attributes: { exclude: ['createdAt', 'password'] },
    });
    return stocks;
  },
  // list stocks
  async listAllStock(table, offset, limit) {
    const stocks = await table.findAll({
      attributes: { exclude: ['createdAt', 'password'] },
      order: [
        ['createdAt', 'DESC'],
      ],
      offset, limit
    });
    return stocks;
  },
  // create stock item
  async addStock(table, item_uuid, title, name, category, description, avatar, uuid, price) {
    const photo = await table.create({
      uuid: item_uuid,
      title,
      professional_name: name,
      category,
      description,
      file: avatar,
      price,
      likes: 0,
      professional_uuid: uuid,
    });
    return photo;
  },
  
  // create a stock article
  async addStockArticle(table, item_uuid, title, name, category, description, file, uuid, price, full_text) {
    const article = await table.create({
      uuid: item_uuid,
      title,
      professional_name: name,
      category,
      description,
      file,
      price,
      likes: 0,
      professional_uuid: uuid,
      full_text,
    });
    return article;
  },

  // search for a stock
  async searchForUser(table, input) {
    const users = await table.findAll({
      where: {
        [Op.or]: [{ name: { [Op.iLike]: `%${input}%` } },
          { username: { [Op.iLike]: `%${input}%` } },
          { email: { [Op.iLike]: `%${input}%` } }],
      },
      order: [
        ['createdAt', 'DESC'],
      ],
      attributes: { exclude: ['createdAt', 'password', 'password', 'updatedAt'] },
    });
    return users;
  },
  // list all data in a table
  async listAllDataInTable(table) {
    const datas = await table.findAll({
      attributes: { exclude: ['createdAt', 'password', 'updatedAt'] },
      order: [
        ['createdAt', 'DESC'],
      ],
    });
    return datas;
  }
};
export default helperMethods;
