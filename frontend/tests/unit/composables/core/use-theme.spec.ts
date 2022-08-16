import withSetup from '../../test-utils'
import useTheme from '../../../../src/composables/core/use-theme'

describe('useTheme', () => {
  afterEach(() => {
    jest.clearAllMocks()
    window.localStorage.clear()
  })

  it('sets default theme color to "light" and saves it to local storage', () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem')
    const [_, app] = withSetup(useTheme)

    expect(setItemSpy).toHaveBeenCalledTimes(1)
    expect(setItemSpy).toHaveBeenCalledWith('themeColor', 'light')
    app?.unmount()
  })

  it('sets theme color after calling setThemeColor() and saves it to local storage', () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem')
    const [result, app] = withSetup<ReturnType<typeof useTheme>>(useTheme)

    result.setThemeColor('dark')
    expect(setItemSpy).toHaveBeenCalledTimes(2)
    expect(setItemSpy).toHaveBeenCalledWith('themeColor', 'dark')
    expect(result.themeColor.value).toEqual('dark')
    expect(window.localStorage.getItem('themeColor')).toEqual('dark')

    app?.unmount()
  })
})
