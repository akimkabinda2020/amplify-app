import React from 'react';
import logo from './logo.svg';
import "@aws-amplify/ui-react/styles.css";
import { Card, View, Image, Heading, Button, withAuthenticator, WithAuthenticatorProps } from '@aws-amplify/ui-react';

function App({ signOut, user }: WithAuthenticatorProps)  {
  return (
   <View className="App">
    <Card>
      <Image src={logo} className="App-logo" alt="logo" />
      <Heading level={1}>{user?.username} now have Auth!</Heading>
    </Card>
    <Button onClick={signOut}> Sign Out</Button>
    <h2>Amplify Todos</h2>
   </View>
  );
}

export default withAuthenticator(App);
