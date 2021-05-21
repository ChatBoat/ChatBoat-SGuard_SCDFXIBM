/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type {Node} from 'react';
import {ScrollView, View, Text} from 'react-native';
import styled, {css} from '@emotion/native';

const Heading = styled.Text`
  font-size: 5rem;
`;

function SensorDisplaySection(): Node {
  return (
    <ScrollView>
      <Heading>Sensors</Heading>
    </ScrollView>
  );
}

function App(): Node {
  return (
    <View>
      <Text
        style={css`
          color: red;
        `}>
        lmao
      </Text>
      <SensorDisplaySection />
    </View>
  );
}

export default App;
