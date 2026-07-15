import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext';

/**
 * Lets the signed-in user pick a profile photo (from library or camera) and
 * saves the chosen image URI onto the user object via AuthContext.updateUser.
 * Returns a single function that opens the source chooser.
 */
export function useAvatarPicker() {
  const { user, updateUser } = useAuth();

  const pickFrom = async (source) => {
    const opts = { allowsEditing: true, aspect: [1, 1], quality: 0.6 };

    if (source === 'camera') {
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (!perm.granted) { Alert.alert('Permission needed', 'Please allow camera access to take a photo.'); return; }
      const res = await ImagePicker.launchCameraAsync(opts);
      if (!res.canceled) updateUser({ avatar: res.assets[0].uri });
    } else {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) { Alert.alert('Permission needed', 'Please allow photo access to choose a picture.'); return; }
      const res = await ImagePicker.launchImageLibraryAsync({ ...opts, mediaTypes: ['images'] });
      if (!res.canceled) updateUser({ avatar: res.assets[0].uri });
    }
  };

  const chooseAvatar = () => {
    const options = [
      { text: 'Take Photo', onPress: () => pickFrom('camera') },
      { text: 'Choose from Library', onPress: () => pickFrom('library') },
    ];
    if (user?.avatar) {
      options.push({ text: 'Remove Photo', style: 'destructive', onPress: () => updateUser({ avatar: null }) });
    }
    options.push({ text: 'Cancel', style: 'cancel' });
    Alert.alert('Profile Photo', 'Update your profile picture', options);
  };

  return chooseAvatar;
}
