import pandas as pd

df = pd.read_csv('words_pos.csv')

filteredDF = df[df['word'].str.len() == 6] #only leaves the words that are 6 letters
#filteredDF = df[~df['pos_tag'].isin(['NN', 'FW', 'NNS'])] #takes out certain types of words, "~" inverts the command

filteredDF.to_csv('filtered_words.csv', index=False)