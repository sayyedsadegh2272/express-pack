const createError = require("http-errors");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const Controller = require("../../../root/controllers/controller");
const {
  RandomOtpGenerator,
  SignAccessToken,
  SignRefreshToken,
} = require("../../../root/utils/function");
const { UserModel } = require("../../user/model");
const { getOtpSchema, checkOtpSchema } = require("../validators/otpSchema");

class UserAuthController extends Controller {
  async getOtp(req, res, next) {
    try {
      await getOtpSchema.validateAsync(req.body);
      const { mobile } = req.body;
      const code = RandomOtpGenerator();
      const result = await this.registerUser(mobile, code);
      if (!result) throw createError.Unauthorized("ورود شما با خطا مواجه شد");
      return res.status(HttpStatus.OK).send({
        statusCode: HttpStatus.OK,
        data: {
          message: "کد اعتبار سنجی با موفقیت برای شما ارسال  شد",
          code,
          mobile,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async checkOtp(req, res, next) {
    try {
      await checkOtpSchema.validateAsync(req.body);
      const { mobile, code } = req.body;
      const user = await UserModel.findOne(
        { mobile },
        {
          first_name: 1,
          last_name: 1,
          mobile: 1,
          email: 1,
          username: 1,
          avatar: 1,
          custom_branding: 1,
          birthday : 1
        }
      );
      if (!user) throw createError.NotFound("کاربری یافت نشد");
      if (user.otp.code != code)
        throw createError.Unauthorized("کد ارسال شده صحیح نمی باشد");
      const now = new Date().getTime();
      if (+user.otp.expiresIn < now)
        throw createError.Unauthorized("کد شما منقضی شده است");
      const accessToken = await SignAccessToken(user._id);
      const refreshToken = await SignRefreshToken(user._id);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: {
          accessToken,
          refreshToken,
          user,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async registerUser(mobile, code) {
    let otp = {
      code,
      expireIn: new Date().getTime() + 120000,
    };
    const result = await this.checkExitUser(mobile);
    if (result) {
      return await this.updateUser(mobile, { otp });
    }
    return !!(await UserModel.create({
      mobile,
      otp,
    }));
  }
  async checkExitUser(mobile) {
    const user = await UserModel.findOne({ mobile });
    return !!user;
  }
  async updateUser(mobile, objectData = {}) {
    Object.keys(objectData).forEach((key) => {
      if (["", " ", 0, null, undefined, "0", NaN].includes(objectData[key]))
        delete objectData[key];
    });
    const updateResult = await UserModel.updateOne(
      { mobile },
      { $set: objectData }
    );
    return !!updateResult.modifiedCount;
  }
}

module.exports = {
  UserAuthController: new UserAuthController(),
};
