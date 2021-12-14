interface ParticipantInput {
  id: string
  _destroy?: boolean
}
export interface ChannelInput {
  channelName: string
  participants: ParticipantInput[]
}

interface HasManyInput {
  nomorAnggota: string,
  _destroy?: boolean
}
export interface PhoneBookInput {
  owner: string,
  contacts: HasManyInput[]
}

export interface GroupInput {
  channelName: string
  participants: HasManyInput[]
}