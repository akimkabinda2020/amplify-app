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

function App() {
  return (
    <View className="App">
      <p>Hello from feat-4</p>
    </View>
  );
}

export default App;
