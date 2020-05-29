import Sequelize, { Op, fn, col, and } from 'sequelize';

const stages = [
    {
        name: 'stage zero',
        stage_no: 0,
        reward: {
          balance: 0
        }
       
    },
    {
      name: 'stage one',
      stage_no: 1,
      reward: {
        balance: 3000
      }
     
    },
    {
        name: 'stage two',
        stage_no: 2,
        reward: {
         balance: 15000
        }
       
    },
    {
        name: 'stage three',
        stage_no: 3,
        reward: {
          balance: 50000,
        }
       
    },
    {
        name: 'stage four',
        stage_no: 4,
        reward: {
         balance: 200000,
         scholarship: 100000,
         Business_startup: true,
         electronic_gadgets: true
        }
       
    },
    {
        name: 'stage five',
        stage_no: 5,
        reward: {
         balance: 50000,
         scholarship: 200000,
         Business_startup: true,
         electronic_gadgets: true
        }
    },
]

const LastStageCompleted = (downlines) => {
  console.log(downlines)
  let stage_completed = 0;
  const dlines = downlines.filter((x) => x.payed);
  console.log(dlines);
  if (dlines.length == 0) {
      stage_completed = 0
      return stage_completed;
  }
  if (dlines.length == 6) {
    stage_completed = 1;
    return stage_completed;
  };
  if (dlines.length > 6) {
    const stage_1_completed = dlines.filter((x) => x.stage_completed == 1);
    const stage_2_completed = dlines.filter((x) => x.stage_completed == 2);
    const stage_3_completed = dlines.filter((x) => x.stage_completed == 3);
    const stage_4_completed = dlines.filter((x) => x.stage_completed == 4);
    const stage_5_completed = dlines.filter((x) => x.stage_completed == 5);
    if (stage_1_completed.length == 14) {
        stage_completed = 2;
        return stage_completed;
    };

    if(stage_2_completed.length == 28) {
        stage_completed = 3;
        return stage_completed;
    };

    if ( stage_3_completed.length == 28) {
        stage_completed = 4;
        return stage_completed;
    }

    if (stage_4_completed.length == 28) {
        stage_completed = 5;
        return stage_completed;
    }
  };
};

const getUserStageAndReward = (downlines) => {
  // console.log(downlines);
  const stage_completed = LastStageCompleted(downlines);
  console.log(stage_completed);
  const stage = stages.filter((x) => x.stage_no == stage_completed)[0];
  // console.log(stage);
  return { stage_completed, reward:stage.reward };
}

export default getUserStageAndReward
