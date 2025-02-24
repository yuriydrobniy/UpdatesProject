/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import type {PropsWithChildren} from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import {HotUpdater} from '@hot-updater/react-native';

import {HOT_UPDATER_SUPABASE_URL} from '@env';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

const RED = '#d70234';
const YELLOW = '#ffd500';
const updateServerSource = `${HOT_UPDATER_SUPABASE_URL}/functions/v1/update-server`;

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const [bundleId, setBundleId] = useState<string | null>(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const id = HotUpdater.getBundleId();
    setBundleId(id);
  }, []);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? RED : YELLOW,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View style={{width: '100%', height: 40, backgroundColor: 'yellow'}} />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <View style={{padding: 24, gap: 16}}>
            <Text style={{color: 'white'}}>
              Build: {__DEV__ ? 'Development' : 'Production'}
            </Text>
            <Text style={{color: 'white'}}>
              Bundle id: {bundleId || 'none'}
            </Text>
            <Text style={{color: 'white'}}>
              URL: {HOT_UPDATER_SUPABASE_URL || 'none'}
            </Text>
            <Text style={{color: 'white'}}>
              Status: {status || 'none'}
            </Text>
            <View style={{flexDirection: 'row', gap: 16}}>
              <Button title="Reload" onPress={() => HotUpdater.reload()} />
              <Button
                title="HotUpdater.runUpdateProcess()"
                onPress={() =>
                  HotUpdater.runUpdateProcess({
                    source: updateServerSource,
                  })
                    .then(status => {
                      const res = JSON.stringify(status);
                      setStatus(res);
                    })
                    .catch(err => {
                      const res = `ERROR: ${JSON.stringify(err)}`;
                      setStatus(res);
                    })
                }
              />
            </View>
          </View>
          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.tsx</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
    color: 'purple',
  },
});

export default HotUpdater.wrap({
  source: updateServerSource,
  requestHeaders: {
    // if you want to use the request headers, you can add them here
  },
  fallbackComponent: ({progress, status}) => (
    <View
      style={{
        flex: 1,
        padding: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      }}>
      {/* You can put a splash image here. */}

      <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold'}}>
        {status === 'UPDATING' ? 'Updating...' : 'Checking for Update...'}
      </Text>
      <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold'}}>
        - Status: {status}
      </Text>
      {progress > 0 ? (
        <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold'}}>
          {Math.round(progress * 100)}%
        </Text>
      ) : null}
    </View>
  ),
})(App);
