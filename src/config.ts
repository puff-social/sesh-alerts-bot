interface Config {
  roles: {
    seshAlerts: string;
    member?: string;
  };
  channels: {
    general: string;
    roles: string;
    seshVoice: string[];
  };
  cooldown: {
    global: number;
    perUser: number;
  }
}

export const serverConfig: { [key: string]: Config } = {
  // puff.social
  '479769841763483658': {
    roles: {
      seshAlerts: '1100653810935930951',
    },
    channels: {
      general: '479780824464490507',
      roles: '1103927473458135121',
      seshVoice: [
        '479770514597085204'
      ]
    },
    cooldown: {
      global: 300,
      perUser: 600
    }
  },

  // Puffco
  '824008760279957555': {
    roles: {
      seshAlerts: '857673029064589342',
      member: '824492382607114251'
    },
    channels: {
      general: '824025570467250236',
      roles: '824022223831433237',
      seshVoice: [
        '824008760845402195',
        '981307943582568538'
      ]
    },
    cooldown: {
      global: 300,
      perUser: 600
    }
  }
}