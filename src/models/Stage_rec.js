export default (sequelize, DataTypes) => {
    const Stage_rec = sequelize.define('Stage_rec', {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      referrer: DataTypes.UUID,
      referee: DataTypes.UUID
    },{
        freezeTableName: true,
    });
    // Stage_rec.associate = () => {
    //   // associations can be defined here
    // };
    return Stage_rec;
  };

  /** STEP 1 */
  // when a user reg, we check for the referer in the stage_rec table, if it exits? then we add the present user registering to the referees array, if the referer id is not in the table, we create a referer row.

 

  // if a user registers, he has a referer. 
  // a referer can only get two direct down-lines.
  // a user must have six down-lines to complete stage one
  // a registered user is related to one direct up-line
  // how do we get all down-lines that are not directly under a user but related to the user.
  // example
  // a = b, c,
  // b = d, f
  // c = e, g
  // e = j, k
  // g = l, m
  // d = n, p

  // a = b , a = c, b = d, b=f, c =e, c = g
 // a  = [b, c,d,f,e,g,j, k,i,m]

  // a = b, c, d, f, e, g
  // b = d, f
  // c = e, g

  // d,f, e, g are not directly related to a but are related because the are related to the children of a which is b and c

  // a referer = null
  // b referer = a
  // c referer = a
  // d referer = b
  // f referer = b
  // e referer = c
  // g referer = c


  // the problem is how to know that d,f,e, g are also down-lines of a even though they are not direct
  