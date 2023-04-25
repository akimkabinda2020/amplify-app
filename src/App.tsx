import React from "react";
import "@aws-amplify/ui-react/styles.css";
import {
  Card,
  View,
  Heading,
  Button,
  withAuthenticator,
  WithAuthenticatorProps,
} from "@aws-amplify/ui-react";

import Notes from "./Notes";

function App({ signOut, user }: WithAuthenticatorProps) {
  return (
    <View className="App">
      <Card>
        <Heading level={1}>{user?.username} now have Auth!</Heading>
      </Card>
      <Button onClick={signOut}> Sign Out</Button>
      <Notes />
    </View>
  );
}

export default withAuthenticator(App);
