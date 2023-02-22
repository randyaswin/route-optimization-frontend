import userReducer from '@app/store/slices/userSlice';
import authReducer from '@app/store/slices/authSlice';
import nightModeReducer from '@app/store/slices/nightModeSlice';
import themeReducer from '@app/store/slices/themeSlice';
import pwaReducer from '@app/store/slices/pwaSlice';
import hubReducer from '@app/store/slices/hubsSlice';
import activeHubReducer from '@app/store/slices/activeHubSlice';
import visitReducer from '@app/store/slices/visitesSlice';
import vehicleReducer from '@app/store/slices/vehiclesSlice';
export default {
  user: userReducer,
  auth: authReducer,
  nightMode: nightModeReducer,
  theme: themeReducer,
  pwa: pwaReducer,
  hubs: hubReducer,
  hubactive: activeHubReducer,
  visites: visitReducer,
  vehicles: vehicleReducer,
};
