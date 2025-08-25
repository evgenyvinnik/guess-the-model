export const ModelName = {
  ChatGPT: 'ChatGPT',
  EMU: 'EMU',
  Gemini: 'Gemini',
  Grok: 'Grok',
} as const;

export type ModelName = typeof ModelName[keyof typeof ModelName];

export interface QuestionEntry {
  image: string;
  modelName: ModelName;
  prompt: string;
}

export const questions: Record<string, QuestionEntry> = {
  'c309a6ea-272b-410c-ab60-c0820dabd6e8': {
    image: 'c309a6ea-272b-410c-ab60-c0820dabd6e8',
    modelName: ModelName.ChatGPT,
    prompt: 'stub',
  },
  '8840f415-c56f-4f95-b425-68ef31d779bd': {
    image: '8840f415-c56f-4f95-b425-68ef31d779bd',
    modelName: ModelName.ChatGPT,
    prompt: 'stub',
  },
  '27abe4d7-b7de-4de0-b5e4-a01415fd6d1b': {
    image: '27abe4d7-b7de-4de0-b5e4-a01415fd6d1b',
    modelName: ModelName.ChatGPT,
    prompt: 'stub',
  },
  '73fe5ddf-4586-4a14-a3e9-39095608a89a': {
    image: '73fe5ddf-4586-4a14-a3e9-39095608a89a',
    modelName: ModelName.ChatGPT,
    prompt: 'stub',
  },
  '68da6d3f-ff56-4be2-bc97-20635bb09063': {
    image: '68da6d3f-ff56-4be2-bc97-20635bb09063',
    modelName: ModelName.ChatGPT,
    prompt: 'stub',
  },
  '551e2a92-cabd-4d75-9c05-5ed545a84fef': {
    image: '551e2a92-cabd-4d75-9c05-5ed545a84fef',
    modelName: ModelName.ChatGPT,
    prompt: 'stub',
  },
  'f0ff48b1-46d4-4c5e-8eae-c1b666656781': {
    image: 'f0ff48b1-46d4-4c5e-8eae-c1b666656781',
    modelName: ModelName.ChatGPT,
    prompt: 'stub',
  },
  '7eca2151-1692-499f-83cf-d05641ab8626': {
    image: '7eca2151-1692-499f-83cf-d05641ab8626',
    modelName: ModelName.ChatGPT,
    prompt: 'stub',
  },
  '897f1d7e-cd25-4f33-8a44-2f627623e4f1': {
    image: '897f1d7e-cd25-4f33-8a44-2f627623e4f1',
    modelName: ModelName.ChatGPT,
    prompt: 'stub',
  },
  '7261c325-21e5-4b19-baa7-30b285957e80': {
    image: '7261c325-21e5-4b19-baa7-30b285957e80',
    modelName: ModelName.ChatGPT,
    prompt: 'stub',
  },
  '1998b059-51eb-4318-905e-2559cc9afbe8': {
    image: '1998b059-51eb-4318-905e-2559cc9afbe8',
    modelName: ModelName.ChatGPT,
    prompt: 'stub',
  },
  'c333e848-d34d-4056-867f-5c0c09ba92d2': {
    image: 'c333e848-d34d-4056-867f-5c0c09ba92d2',
    modelName: ModelName.ChatGPT,
    prompt: 'stub',
  },
  '3ac5e0a8-f8ee-4ef8-88db-ce7f7741d77c': {
    image: '3ac5e0a8-f8ee-4ef8-88db-ce7f7741d77c',
    modelName: ModelName.ChatGPT,
    prompt: 'stub',
  },
  'b229bac7-d63a-4d8b-aac6-be0343c6ca81': {
    image: 'b229bac7-d63a-4d8b-aac6-be0343c6ca81',
    modelName: ModelName.ChatGPT,
    prompt: 'stub',
  },
  'e4e63256-46b2-4176-87fb-2c7154bce3e3': {
    image: 'e4e63256-46b2-4176-87fb-2c7154bce3e3',
    modelName: ModelName.ChatGPT,
    prompt: 'stub',
  },
  'f5792c23-6482-4295-9531-987edf56a493': {
    image: 'f5792c23-6482-4295-9531-987edf56a493',
    modelName: ModelName.ChatGPT,
    prompt: 'stub',
  },
  'c2d98cf7-2dbc-4411-b632-52e6d69d85b0': {
    image: 'c2d98cf7-2dbc-4411-b632-52e6d69d85b0',
    modelName: ModelName.ChatGPT,
    prompt: 'stub',
  },
  'f6a54a2f-272a-49f0-b28c-b30f7611a767': {
    image: 'f6a54a2f-272a-49f0-b28c-b30f7611a767',
    modelName: ModelName.ChatGPT,
    prompt: 'stub',
  },
  '3dc15c44-1819-421d-bc69-bfd98c70f7e8': {
    image: '3dc15c44-1819-421d-bc69-bfd98c70f7e8',
    modelName: ModelName.ChatGPT,
    prompt: 'stub',
  },
  '407dc70a-704d-4397-a9e2-0b5111f76ea5': {
    image: '407dc70a-704d-4397-a9e2-0b5111f76ea5',
    modelName: ModelName.ChatGPT,
    prompt: 'stub',
  },
  '22b18f17-4bf0-4ba9-8a7b-f156e13b82d7': {
    image: '22b18f17-4bf0-4ba9-8a7b-f156e13b82d7',
    modelName: ModelName.ChatGPT,
    prompt: 'stub',
  },
  'eb87adae-86fa-4a39-9705-4aab5e7cab6e': {
    image: 'eb87adae-86fa-4a39-9705-4aab5e7cab6e',
    modelName: ModelName.ChatGPT,
    prompt: 'stub',
  },
  '88e45f77-404f-4dc9-9d64-dda2495a6137': {
    image: '88e45f77-404f-4dc9-9d64-dda2495a6137',
    modelName: ModelName.ChatGPT,
    prompt: 'stub',
  },
  'f8d6a2eb-811d-4636-aac6-9cb9e27fe187': {
    image: 'f8d6a2eb-811d-4636-aac6-9cb9e27fe187',
    modelName: ModelName.ChatGPT,
    prompt: 'stub',
  },
  '598b0797-1533-4353-a7b6-26d8f4ad837e': {
    image: '598b0797-1533-4353-a7b6-26d8f4ad837e',
    modelName: ModelName.ChatGPT,
    prompt: 'stub',
  },
  'b9f615a9-13bc-4870-a900-14446a5421ec': {
    image: 'b9f615a9-13bc-4870-a900-14446a5421ec',
    modelName: ModelName.EMU,
    prompt: 'stub',
  },
  '535c5f65-fed7-4087-8da1-89ff61f6a456': {
    image: '535c5f65-fed7-4087-8da1-89ff61f6a456',
    modelName: ModelName.EMU,
    prompt: 'stub',
  },
  '15ad6798-2a6f-4115-bb4a-e7cedd9bd240': {
    image: '15ad6798-2a6f-4115-bb4a-e7cedd9bd240',
    modelName: ModelName.EMU,
    prompt: 'stub',
  },
  'ae14d03e-1878-4fc2-aeac-479bc90da8cf': {
    image: 'ae14d03e-1878-4fc2-aeac-479bc90da8cf',
    modelName: ModelName.EMU,
    prompt: 'stub',
  },
  'aee53ca2-b570-4470-895b-26f93bf98d6b': {
    image: 'aee53ca2-b570-4470-895b-26f93bf98d6b',
    modelName: ModelName.EMU,
    prompt: 'stub',
  },
  'fb0a58d4-61f5-4f3c-a414-dee901b4b08f': {
    image: 'fb0a58d4-61f5-4f3c-a414-dee901b4b08f',
    modelName: ModelName.EMU,
    prompt: 'stub',
  },
  '2c0e1ed9-5dd1-431d-9f9e-5fba6b1b25b1': {
    image: '2c0e1ed9-5dd1-431d-9f9e-5fba6b1b25b1',
    modelName: ModelName.EMU,
    prompt: 'stub',
  },
  '70e839a4-d23f-4738-b880-096e5a2a697a': {
    image: '70e839a4-d23f-4738-b880-096e5a2a697a',
    modelName: ModelName.EMU,
    prompt: 'stub',
  },
  '7d213e68-9875-4485-ba07-56a17137e766': {
    image: '7d213e68-9875-4485-ba07-56a17137e766',
    modelName: ModelName.EMU,
    prompt: 'stub',
  },
  '9c5be6c5-63d3-4495-ba12-a6381834d363': {
    image: '9c5be6c5-63d3-4495-ba12-a6381834d363',
    modelName: ModelName.EMU,
    prompt: 'stub',
  },
  '0ee46305-07a5-4267-98df-be026fa5492c': {
    image: '0ee46305-07a5-4267-98df-be026fa5492c',
    modelName: ModelName.EMU,
    prompt: 'stub',
  },
  '78fdf647-644d-41fb-ba34-035ca6f57f83': {
    image: '78fdf647-644d-41fb-ba34-035ca6f57f83',
    modelName: ModelName.EMU,
    prompt: 'stub',
  },
  'b18ad869-8768-4f74-9e0b-017703bab9e8': {
    image: 'b18ad869-8768-4f74-9e0b-017703bab9e8',
    modelName: ModelName.EMU,
    prompt: 'stub',
  },
  'a0d56005-d60e-4e1b-9290-134d45ea0cf2': {
    image: 'a0d56005-d60e-4e1b-9290-134d45ea0cf2',
    modelName: ModelName.EMU,
    prompt: 'stub',
  },
  '053375ac-6cec-458e-9404-9a1f6c80d15d': {
    image: '053375ac-6cec-458e-9404-9a1f6c80d15d',
    modelName: ModelName.EMU,
    prompt: 'stub',
  },
  'b136a7f8-fb68-4f3a-8df3-fb816aa30d7d': {
    image: 'b136a7f8-fb68-4f3a-8df3-fb816aa30d7d',
    modelName: ModelName.EMU,
    prompt: 'stub',
  },
  '2fdb8265-f3e0-4138-9895-d018d5479663': {
    image: '2fdb8265-f3e0-4138-9895-d018d5479663',
    modelName: ModelName.EMU,
    prompt: 'stub',
  },
  '794f1c2b-4f70-47b9-a5f3-e254228510b2': {
    image: '794f1c2b-4f70-47b9-a5f3-e254228510b2',
    modelName: ModelName.EMU,
    prompt: 'stub',
  },
  '7572cfac-c49e-4704-9bb2-e96d65bb4ca6': {
    image: '7572cfac-c49e-4704-9bb2-e96d65bb4ca6',
    modelName: ModelName.EMU,
    prompt: 'stub',
  },
  '323ff30a-9ccc-43a1-8dc6-14d3ec2e4765': {
    image: '323ff30a-9ccc-43a1-8dc6-14d3ec2e4765',
    modelName: ModelName.EMU,
    prompt: 'stub',
  },
  'a374ec10-1605-40c7-9859-1581461ef8aa': {
    image: 'a374ec10-1605-40c7-9859-1581461ef8aa',
    modelName: ModelName.EMU,
    prompt: 'stub',
  },
  'e7b8257f-cad2-40e8-8cd4-4fc7bb3ee658': {
    image: 'e7b8257f-cad2-40e8-8cd4-4fc7bb3ee658',
    modelName: ModelName.EMU,
    prompt: 'stub',
  },
  'f805a41f-fd8d-4c00-8acc-8494e05d4e42': {
    image: 'f805a41f-fd8d-4c00-8acc-8494e05d4e42',
    modelName: ModelName.EMU,
    prompt: 'stub',
  },
  '4d5bf20e-c4dd-4935-bf87-f6d8a14e6a6a': {
    image: '4d5bf20e-c4dd-4935-bf87-f6d8a14e6a6a',
    modelName: ModelName.EMU,
    prompt: 'stub',
  },
  '3d73feec-9997-41c5-bb4c-d18d93550e3e': {
    image: '3d73feec-9997-41c5-bb4c-d18d93550e3e',
    modelName: ModelName.EMU,
    prompt: 'stub',
  },
  'dccf540d-9464-49b5-96db-1221247d8f42': {
    image: 'dccf540d-9464-49b5-96db-1221247d8f42',
    modelName: ModelName.Gemini,
    prompt: 'stub',
  },
  'd55fa1fb-5dcb-4b8c-b8cb-24c4ef0c9639': {
    image: 'd55fa1fb-5dcb-4b8c-b8cb-24c4ef0c9639',
    modelName: ModelName.Gemini,
    prompt: 'stub',
  },
  '893a4b4c-5799-4d13-8b65-3eb60b5fe11e': {
    image: '893a4b4c-5799-4d13-8b65-3eb60b5fe11e',
    modelName: ModelName.Gemini,
    prompt: 'stub',
  },
  'c615390f-e305-4313-9fc2-3003f6cf7b9e': {
    image: 'c615390f-e305-4313-9fc2-3003f6cf7b9e',
    modelName: ModelName.Gemini,
    prompt: 'stub',
  },
  'afef4399-c5e2-4f5d-82ff-00b5a9bc0126': {
    image: 'afef4399-c5e2-4f5d-82ff-00b5a9bc0126',
    modelName: ModelName.Gemini,
    prompt: 'stub',
  },
  '31f52cfa-0659-492b-8dd3-3451879990aa': {
    image: '31f52cfa-0659-492b-8dd3-3451879990aa',
    modelName: ModelName.Gemini,
    prompt: 'stub',
  },
  'f1403770-dde7-444b-adab-f4fa518ad81e': {
    image: 'f1403770-dde7-444b-adab-f4fa518ad81e',
    modelName: ModelName.Gemini,
    prompt: 'stub',
  },
  'ec46f3dc-0be3-47ed-ac64-6083cedb8d33': {
    image: 'ec46f3dc-0be3-47ed-ac64-6083cedb8d33',
    modelName: ModelName.Gemini,
    prompt: 'stub',
  },
  'ab6439e6-ff67-4374-a3fa-32be341a02f4': {
    image: 'ab6439e6-ff67-4374-a3fa-32be341a02f4',
    modelName: ModelName.Gemini,
    prompt: 'stub',
  },
  'cb066bb5-f37c-458c-af13-2e0ac3c59e58': {
    image: 'cb066bb5-f37c-458c-af13-2e0ac3c59e58',
    modelName: ModelName.Gemini,
    prompt: 'stub',
  },
  '604d2b29-9408-4341-bc8e-f6f86bee87f4': {
    image: '604d2b29-9408-4341-bc8e-f6f86bee87f4',
    modelName: ModelName.Gemini,
    prompt: 'stub',
  },
  'c9522be2-fee7-4fc0-9996-3870b634ad35': {
    image: 'c9522be2-fee7-4fc0-9996-3870b634ad35',
    modelName: ModelName.Gemini,
    prompt: 'stub',
  },
  '0d36eef4-fba5-4345-a84c-1120fb188846': {
    image: '0d36eef4-fba5-4345-a84c-1120fb188846',
    modelName: ModelName.Gemini,
    prompt: 'stub',
  },
  'aa83b923-8cf0-48e2-b41b-dcaf1cdb33ce': {
    image: 'aa83b923-8cf0-48e2-b41b-dcaf1cdb33ce',
    modelName: ModelName.Gemini,
    prompt: 'stub',
  },
  'e3b157a0-398d-481a-b9a9-5eabb226a6d9': {
    image: 'e3b157a0-398d-481a-b9a9-5eabb226a6d9',
    modelName: ModelName.Gemini,
    prompt: 'stub',
  },
  '8651fbf2-fe3f-4cfe-afda-d9cf6919bf04': {
    image: '8651fbf2-fe3f-4cfe-afda-d9cf6919bf04',
    modelName: ModelName.Gemini,
    prompt: 'stub',
  },
  'd74c4364-4586-42fc-ada1-60252195074d': {
    image: 'd74c4364-4586-42fc-ada1-60252195074d',
    modelName: ModelName.Gemini,
    prompt: 'stub',
  },
  '73285650-0ac4-4802-bb8c-79a4aa252607': {
    image: '73285650-0ac4-4802-bb8c-79a4aa252607',
    modelName: ModelName.Gemini,
    prompt: 'stub',
  },
  '2c719064-80aa-4113-9d11-2e8139f60806': {
    image: '2c719064-80aa-4113-9d11-2e8139f60806',
    modelName: ModelName.Gemini,
    prompt: 'stub',
  },
  'f16bd2bf-62e0-452e-b97a-69b4317e7afc': {
    image: 'f16bd2bf-62e0-452e-b97a-69b4317e7afc',
    modelName: ModelName.Gemini,
    prompt: 'stub',
  },
  'aba57950-6b47-4376-9959-4924827cf725': {
    image: 'aba57950-6b47-4376-9959-4924827cf725',
    modelName: ModelName.Gemini,
    prompt: 'stub',
  },
  'ec70773a-b879-45c3-b057-61949cc86aa3': {
    image: 'ec70773a-b879-45c3-b057-61949cc86aa3',
    modelName: ModelName.Gemini,
    prompt: 'stub',
  },
  '7311c92b-d877-4977-8ff9-bcf11a1b3fc1': {
    image: '7311c92b-d877-4977-8ff9-bcf11a1b3fc1',
    modelName: ModelName.Gemini,
    prompt: 'stub',
  },
  'fd44f870-70b1-4597-b906-b955b32f7804': {
    image: 'fd44f870-70b1-4597-b906-b955b32f7804',
    modelName: ModelName.Gemini,
    prompt: 'stub',
  },
  '9020a5b0-5d06-4f52-9ecd-2cfde7464c62': {
    image: '9020a5b0-5d06-4f52-9ecd-2cfde7464c62',
    modelName: ModelName.Gemini,
    prompt: 'stub',
  },
  '4aeeca87-c920-4c98-b59e-5dd08c512049': {
    image: '4aeeca87-c920-4c98-b59e-5dd08c512049',
    modelName: ModelName.Grok,
    prompt: 'stub',
  },
  '029b4b2b-08c2-4ad2-96ea-4451177932a4': {
    image: '029b4b2b-08c2-4ad2-96ea-4451177932a4',
    modelName: ModelName.Grok,
    prompt: 'stub',
  },
  '2e3f92a1-7121-41d3-8b9f-2ac432b31ec0': {
    image: '2e3f92a1-7121-41d3-8b9f-2ac432b31ec0',
    modelName: ModelName.Grok,
    prompt: 'stub',
  },
  '4a3ccfd7-5148-4e90-9b77-936d351755e3': {
    image: '4a3ccfd7-5148-4e90-9b77-936d351755e3',
    modelName: ModelName.Grok,
    prompt: 'stub',
  },
  'ac457313-07bb-4163-91ae-039ed1b1d408': {
    image: 'ac457313-07bb-4163-91ae-039ed1b1d408',
    modelName: ModelName.Grok,
    prompt: 'stub',
  },
  'fc8454dc-f456-4d0c-886b-9e921243c111': {
    image: 'fc8454dc-f456-4d0c-886b-9e921243c111',
    modelName: ModelName.Grok,
    prompt: 'stub',
  },
  '99a06951-b57b-4379-8b33-3e114db770da': {
    image: '99a06951-b57b-4379-8b33-3e114db770da',
    modelName: ModelName.Grok,
    prompt: 'stub',
  },
  '1816cd2f-2362-4d82-b231-f52da32d1bee': {
    image: '1816cd2f-2362-4d82-b231-f52da32d1bee',
    modelName: ModelName.Grok,
    prompt: 'stub',
  },
  '670eb3cc-23b2-40eb-bf34-4ce22fb7d836': {
    image: '670eb3cc-23b2-40eb-bf34-4ce22fb7d836',
    modelName: ModelName.Grok,
    prompt: 'stub',
  },
  '31005302-1eb7-43b2-bace-1187ce002c8c': {
    image: '31005302-1eb7-43b2-bace-1187ce002c8c',
    modelName: ModelName.Grok,
    prompt: 'stub',
  },
  'f9243eaa-6da6-423a-ad04-7062255973f8': {
    image: 'f9243eaa-6da6-423a-ad04-7062255973f8',
    modelName: ModelName.Grok,
    prompt: 'stub',
  },
  'bc7ad79d-008d-4a9d-9c7e-cfb730033027': {
    image: 'bc7ad79d-008d-4a9d-9c7e-cfb730033027',
    modelName: ModelName.Grok,
    prompt: 'stub',
  },
  '733e91f9-aaa8-4e57-a714-bbecbe8d1f88': {
    image: '733e91f9-aaa8-4e57-a714-bbecbe8d1f88',
    modelName: ModelName.Grok,
    prompt: 'stub',
  },
  'f9187782-01bf-471f-83ec-8dfcc25b49e7': {
    image: 'f9187782-01bf-471f-83ec-8dfcc25b49e7',
    modelName: ModelName.Grok,
    prompt: 'stub',
  },
  'a973352e-8837-4503-a344-58730f4de61c': {
    image: 'a973352e-8837-4503-a344-58730f4de61c',
    modelName: ModelName.Grok,
    prompt: 'stub',
  },
  '42a7b426-3b57-4e6f-aae0-88ebeeded543': {
    image: '42a7b426-3b57-4e6f-aae0-88ebeeded543',
    modelName: ModelName.Grok,
    prompt: 'stub',
  },
  'da88312a-cf70-409e-bc2f-d2bb06927aac': {
    image: 'da88312a-cf70-409e-bc2f-d2bb06927aac',
    modelName: ModelName.Grok,
    prompt: 'stub',
  },
  'be1f0940-0e58-4393-bff2-ed8af4041d8a': {
    image: 'be1f0940-0e58-4393-bff2-ed8af4041d8a',
    modelName: ModelName.Grok,
    prompt: 'stub',
  },
  '7b980cac-21d0-4e68-b802-dc275615cc9b': {
    image: '7b980cac-21d0-4e68-b802-dc275615cc9b',
    modelName: ModelName.Grok,
    prompt: 'stub',
  },
  'e2ef964b-de00-49c6-927c-0356be6c6e35': {
    image: 'e2ef964b-de00-49c6-927c-0356be6c6e35',
    modelName: ModelName.Grok,
    prompt: 'stub',
  },
  '3fcecf67-5576-4c40-b59f-be6a02fd0df2': {
    image: '3fcecf67-5576-4c40-b59f-be6a02fd0df2',
    modelName: ModelName.Grok,
    prompt: 'stub',
  },
  'f8de527e-af19-4531-8c7c-e10b5074c228': {
    image: 'f8de527e-af19-4531-8c7c-e10b5074c228',
    modelName: ModelName.Grok,
    prompt: 'stub',
  },
  'a6ccbce5-253e-405a-9c35-f97423d8d92a': {
    image: 'a6ccbce5-253e-405a-9c35-f97423d8d92a',
    modelName: ModelName.Grok,
    prompt: 'stub',
  },
  'c56300a4-e4e1-48ae-9dc1-60b7064fd81f': {
    image: 'c56300a4-e4e1-48ae-9dc1-60b7064fd81f',
    modelName: ModelName.Grok,
    prompt: 'stub',
  },
  '9565479e-587c-4c64-a874-090f0472f96f': {
    image: '9565479e-587c-4c64-a874-090f0472f96f',
    modelName: ModelName.Grok,
    prompt: 'stub',
  },
};
