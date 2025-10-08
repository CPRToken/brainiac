import type { Profile } from 'src/types/social';

import { db } from 'src/libs/firebase';
import { doc, getDoc } from 'firebase/firestore';




type GetProfileRequest = { uid?: string };

class SocialApi {


  async getProfile(request: GetProfileRequest = {}): Promise<Profile> {
    const uid = request.uid;
    if (!uid) {
      return Promise.reject(new Error('No user ID provided for getting profile'));
    }

    const userDocRef = doc(db, 'users', uid);

    return getDoc(userDocRef)
      .then(docSnap => {
        if (!docSnap.exists()) {
          throw new Error('User not found');
        }

        const userData = docSnap.data();

        console.log("Profile data from socialApi:", {
          uid: uid,
          ...userData
        });
        const constructedName = `${userData.firstName} ${userData.lastName}`;
        console.log("Constructed name:", constructedName);

        return {
          uid: uid,

          email: userData.email || '',
          gender: userData.gender || '',
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          name: `${userData.firstName} ${userData.lastName}`,
          stripeCustomerId: userData.stripeCustomerId || '',
          loginEvents: userData.loginEvents || [],
          priceId: userData.priceId || '',
         role: userData.role || '',
          plan: userData.plan || '',
          refUrl: userData.refUrl || '',
          planStartDate: userData.planStartDate || '',



        };

      });
  }



}

export const socialApi = new SocialApi();
