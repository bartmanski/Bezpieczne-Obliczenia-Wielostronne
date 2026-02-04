import React from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import { usePSIEmptiness } from '../hooks/usePSIEmptiness';

type Props = {
    mySet: string[];
};

export default function PSIButton({ mySet }: Props) {
    const { startPSI, isIntersectionEmpty } = usePSIEmptiness(mySet);

    return (
        <View style={styles.container}>
            <Button title="Start PSI" onPress={() => { void startPSI(); }} />
            <Text style={styles.status}>
                {isIntersectionEmpty === null
                    ? 'Not started'
                    : isIntersectionEmpty
                    ? 'No intersection'
                    : 'Intersection found'}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 8,
        alignItems: 'center',
    },
    status: {
        marginTop: 8,
    },
});