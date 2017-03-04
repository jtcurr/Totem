import React from 'react';
import { connect } from 'react-redux';
import store from '../redux/store.js';
import firebase from 'firebase'

/*  Components  */
import MapViewer from './MapViewer/MapViewer';
import ChooseGroup from './InitConfig/ChooseGroup.jsx';
import ChooseVenue from './InitConfig/ChooseVenue.jsx';
import SignInButton from './Auth/SignInButton';
import Loading from './Auth/Loading';

/* Actions */
import { defaultAgenda } from '../redux/actions/agendaActions';
import { setDefaultChat } from '../redux/actions/chatActions';
import { signIn, signInSuccess, getUserData } from '../redux/actions/authenticationActions';
import { geolocate } from '../redux/actions';

export class HomeView extends React.Component {
  componentWillMount() {
    const props = this.props;
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        geolocate();
        signInSuccess(user.uid, user.displayName);
        getUserData(user.uid);
        //just for testing. this line needs to be removed later on
        setDefaultChat("-KdSF7i59sk07XoRgcYo");
      }
    });
  }

  render() {
    const { auth, dispatch, group, user } = this.props;
    const hasPendingInvites = Object.keys(user.pendingInvites).length > 0;
    const hasGroup = !!user.groupId;

    return (
      !auth.isUserSignedIn ? <SignInButton onSignInClick={signIn} auth={auth}/> :
      !user.dataRetrieved ? <Loading /> :
      hasPendingInvites && !hasGroup ? <ChooseGroup /> :
      !hasGroup ? <ChooseVenue /> : <MapViewer />
    );
  }
}


export default connect((store) => {
  return {
    user: store.user,
    nav: store.nav,
    group: store.group,
    auth: store.auth
  };
})(HomeView);
