interface IGetDateTime {
  // getDays(dayCount: number, isByMilliseconds?: boolean): number
}

export class GetDateTime implements IGetDateTime {
  /** Returns the duration in seconds the day inputed */
  static getDays(dayCount: number, isByMilliseconds?: boolean): number {
    return (isByMilliseconds ? 1000 : 1) * 60 * 60 * 24 * dayCount
  }
}
