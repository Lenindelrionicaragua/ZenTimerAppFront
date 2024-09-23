import { renderHook, act } from "@testing-library/react-hooks";
import useFetch from "../../hooks/useFetch";

describe("useFetch Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should handle successful GET request", async () => {
    const mockResponse = { success: true, data: "test data" };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponse)
    });

    const onReceived = jest.fn();
    const { result, waitForNextUpdate } = renderHook(() =>
      useFetch("/test-route", onReceived)
    );

    act(() => {
      result.current.performFetch();
    });

    await waitForNextUpdate();

    expect(onReceived).toHaveBeenCalledWith(mockResponse);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it("should handle failed GET request", async () => {
    fetch.mockRejectedValueOnce(new Error("Network Error"));

    const onReceived = jest.fn();
    const { result, waitForNextUpdate } = renderHook(() =>
      useFetch("/test-route", onReceived)
    );

    act(() => {
      result.current.performFetch();
    });

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error.message).toBe("Network Error");
  });

  it("should handle unsuccessful response", async () => {
    const mockResponse = { success: false, msg: "Error message" };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponse)
    });

    const onReceived = jest.fn();
    const { result, waitForNextUpdate } = renderHook(() =>
      useFetch("/test-route", onReceived)
    );

    act(() => {
      result.current.performFetch();
    });

    await waitForNextUpdate();

    expect(onReceived).not.toHaveBeenCalled();
    expect(result.current.error).toBe("Error message");
  });

  it("should handle null request parameters", async () => {
    const { result } = renderHook(() => useFetch(null, jest.fn()));

    expect(() => result.current.performFetch()).toThrow(
      "Invalid route provided"
    );
  });

  it("should handle invalid URL", async () => {
    const { result } = renderHook(() => useFetch("invalid-url", jest.fn()));

    await act(async () => {
      await result.current.performFetch();
    });

    expect(result.current.error).toBe("Invalid URL");
  });

  it("should call cancelFetch to abort the fetch request", async () => {
    const mockResponse = { success: true, data: "test data" };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponse)
    });

    const onReceived = jest.fn();
    const { result } = renderHook(() => useFetch("/test-route", onReceived));

    act(() => {
      result.current.performFetch();
    });

    act(() => {
      result.current.cancelFetch();
    });

    await new Promise(resolve => setTimeout(resolve, 100));

    act(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error.message).toMatch("Fetch was canceled");
    });
  });
});
