import React from 'react';
import {
    StyleSheet,
    View,
  } from 'react-native';
  import {
    Button,
    Card,
    CardHeader,
    Text,
    Divider,
    Icon,
    Layout
  } from '@ui-kitten/components';

const item = {
    ingredients : [
        {am: "1/3 oz of", ing: "cherry whiskey"},
        {am: "2/3 oz of", ing: "Swiss chocolate almond liqueur"},
        {am: "6 oz of", ing: "hot chocolate"}
    ],
    recipe: "Mix in Poca Grande glass, top with whipped cream. Garnish with a cherry and chocolate sprinkles."
}

const ShareIcon = (style) => (
    <Icon 
      {...style}
      name='share'
      width={30}
      height={30}
    />
  );

const HeartIcon = (style) => (
    <Icon 
      {...style} 
      name='heart-outline'
      width={30}
      height={30}
    />
  );

const Header = () => (
    <CardHeader
      title='Black Forest Cake'
      description='by CocktailBuilder'
    />
  );
  
  const Footer = () => (
    <View style={styles.footerContainer}>
      <Button
        style={styles.footerControl}
        appearance='ghost'
        icon={ShareIcon}
      />
      <Button
        style={styles.footerControl}
        status='danger'
        appearance='ghost'
        icon={HeartIcon}
      />
    </View>
  );

const RecipeCard = ({style, }) => {

    const openIngredient = (ing) => {
        console.warn(ing)
    }

    return (
      <Layout style={{...styles.card, ...style}}>
        <Card header={Header} footer={Footer} style={styles.card}>
            <Layout>
                {item.ingredients.map((e, i) => (
                    <Text category='s1' key={i}> 
                        {e.am} <Text style={styles.link} status='primary' category='s1' onPress={() => openIngredient(e.ing)}>{e.ing}</Text>
                    </Text>
                ))}
            </Layout>
            <Divider style={styles.divider}/>
            <Layout>
                <Text>
                    {item.recipe}
                </Text>
            </Layout>
        </Card>
      </Layout>
    );
}

const styles = StyleSheet.create({
    footerContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    card: {
      justifyContent: 'center',
      alignItems: 'center',
      maxWidth: '100%',
      marginBottom: 8,
      marginTop: 8,
      marginHorizontal: 8,
      borderRadius: 10,
      borderColor: 'transparent',
      shadowColor: "#000",
      shadowOffset: {
          width: 0,
          height: 3,
      },
      shadowOpacity: 0.29,
      shadowRadius: 4.65,
      elevation: 7,
      },
    divider: {
        marginBottom: 16,
        marginTop: 16,
    },
    link: {
        padding: 0,
        margin: 0,
    }
  });

export default RecipeCard;