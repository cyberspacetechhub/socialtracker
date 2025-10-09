const userService = require('../services/userService');

class UserController {
  async register(req, res, next) {
    try {
      const { email, password, name } = req.body;
      
      if (!email || !password || !name) {
        return res.status(400).json({ error: 'All fields are required' });
      }
      
      const result = await userService.createUser({ email, password, name });
      res.status(201).json(result);
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({ error: 'Email already exists' });
      }
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }
      
      const result = await userService.authenticateUser(email, password);
      res.json(result);
    } catch (error) {
      if (error.message === 'Invalid credentials') {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      next(error);
    }
  }

  async getProfile(req, res, next) {
    try {
      const user = await userService.getUserById(req.user._id);
      res.json({ user });
    } catch (error) {
      next(error);
    }
  }

  async updateLimits(req, res, next) {
    try {
      const { limits } = req.body;
      const user = await userService.updateUserLimits(req.user._id, limits);
      res.json({ user });
    } catch (error) {
      next(error);
    }
  }

  async updateNotifications(req, res, next) {
    try {
      const { notifications } = req.body;
      const user = await userService.updateNotificationSettings(req.user._id, notifications);
      res.json({ user });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const { name, email } = req.body;
      const user = await userService.updateProfile(req.user._id, { name, email });
      res.json({ user });
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;
      await userService.changePassword(req.user._id, currentPassword, newPassword);
      res.json({ message: 'Password changed successfully' });
    } catch (error) {
      if (error.message === 'Invalid current password') {
        return res.status(400).json({ error: 'Invalid current password' });
      }
      next(error);
    }
  }

  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }
      
      await userService.sendPasswordResetCode(email);
      res.json({ message: 'Reset code sent to email (check server logs if email not configured)' });
    } catch (error) {
      if (error.message === 'User not found') {
        return res.status(404).json({ error: 'User not found' });
      }
      console.error('Forgot password error:', error);
      next(error);
    }
  }

  async verifyResetCode(req, res, next) {
    try {
      const { email, code } = req.body;
      const isValid = await userService.verifyResetCode(email, code);
      res.json({ valid: isValid });
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req, res, next) {
    try {
      const { email, code, newPassword } = req.body;
      await userService.resetPassword(email, code, newPassword);
      res.json({ message: 'Password reset successfully' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();