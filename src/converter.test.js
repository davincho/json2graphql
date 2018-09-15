import { convertObject, convertString } from './converter';

describe('json to  graphql', () => {
  const normalize = value =>
    value
      .replace(/[ \r\n]/g, ' ')
      .replace(/[ ]{2,}/g, ' ')
      .trim();

  it('should convert a json object to a graphql type', () => {
    const source = {
      id: 1,
      balance: 12.12,
      admin: true,
      firstName: 'David',
      lastName: 'Madner'
    };

    expect(normalize(convertObject(source, 'user'))).toEqual(
      normalize(`type User {
         id: ID!
         admin: Boolean
         balance: Float
         firstName: String
         lastName: String
       }`)
    );
  });

  it('should convert nested object into separate types', () => {
    const source = {
      id: 1,
      name: 'David',
      comments: [
        {
          id: 1,
          text: 'Test'
        }
      ],
      team: {
        id: 1,
        name: 'Tourradar',
        count: 5
      }
    };

    expect(normalize(convertObject(source, 'user'))).toEqual(
      normalize(`
        
        type User {
           id: ID!
           comments: [Comment]
           name: String
           team: Team
         }

         type Comment {
           id: ID!  
           text: String
         }
         
         type Team {
             id: ID!
             count: Int
             name: String
         }`)
    );
  });

  it('should convert a JSON string to GraphQL schema', () => {
    const source = `{
        id: 1,
        name: 'David',
        comments: [
          {
            id: 1,
            text: 'Test'
          }
        ],
        team: {
          id: 1,
          name: 'Tourradar',
          count: 5
        }
      }`;

    expect(normalize(convertString(source, 'user'))).toEqual(
      normalize(`
          
          type User {
             id: ID!
             comments: [Comment]
             name: String
             team: Team
           }
  
           type Comment {
             id: ID!  
             text: String
           }
           
           type Team {
               id: ID!
               count: Int
               name: String
           }`)
    );
  });
});
