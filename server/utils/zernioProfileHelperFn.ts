import zernio from "../config/zernio.js";
import { User } from "../models/Users.js";

const getOrCreateZernioProfile = async (
  user: any
): Promise<string> => {
  try {
    // Get existing profiles
    const result = await zernio.profiles.listProfiles();

    const data = result.data as any;

    const profiles: any[] = Array.isArray(data)
      ? data
      : data?.profiles || data?.data || [];

    // Use existing profile if available
    if (profiles.length > 0) {
      const pid = profiles[0]._id || profiles[0].id;

      await User.findByIdAndUpdate(user._id, {
        zernioProfileId: pid,
      });

      return pid;
    }

    // Create new profile
    const createResult = await zernio.profiles.createProfile({
      body: {
        name: `${user.name || user.email}'s workspace`,
      } as any,
    });

    const created =
      (createResult.data as any)?.profile ||
      createResult.data;

    const pid =
      created?._id ||
      created?.id;

    if (!pid) {
      throw new Error(
        "Failed to create Zernio profile - no ID returned"
      );
    }

    await User.findByIdAndUpdate(user._id, {
      zernioProfileId: pid,
    });

    return pid;
  } catch (error: any) {
    console.error(
      "getOrCreateZernioProfile Error:",
      error?.message || error
    );

    throw error;
  }
};

export default getOrCreateZernioProfile;