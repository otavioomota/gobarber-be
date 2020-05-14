import { Request, Response } from 'express';
import { container } from 'tsyringe';

import UploadUserAvatarService from '@modules/users/services/UploadUserAvatarService';

class UserAvatarController {
  public async update(req: Request, res: Response): Promise<Response> {
    const uploadAvatarService = container.resolve(UploadUserAvatarService);

    const user = await uploadAvatarService.execute({
      user_id: req.user.id,
      avatarFilename: req.file.filename,
    });

    delete user.password;

    return res.json(user);
  }
}

export default UserAvatarController;
