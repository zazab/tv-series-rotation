import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ImgHTMLAttributes } from "react";
import { MarkUnwatchedButton } from "@/components/mark-unwatched-button";
import { SeriesRotationList } from "@/components/series-rotation-list";

vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: (props: ImgHTMLAttributes<HTMLImageElement>) => <img {...props} alt={props.alt} />
}));

describe("SeriesRotationList", () => {
  it("renders an empty state", () => {
    render(<SeriesRotationList items={[]} />);

    expect(screen.getByText("No series found")).toBeInTheDocument();
  });

  it("renders list items with metadata", () => {
    render(
      <SeriesRotationList
        items={[
          {
            plexRatingKey: "show-1",
            title: "Rotation Show",
            lastPlayedAt: null,
            playState: "never_played",
            episodeCount: 12,
            watchedEpisodeCount: 4
          }
        ]}
      />
    );

    expect(screen.getByText("Rotation Show")).toBeInTheDocument();
    expect(screen.getAllByText("Never played")).toHaveLength(2);
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
  });
});

describe("MarkUnwatchedButton", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("shows a success state when the api call succeeds", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn()
    });

    vi.stubGlobal("fetch", fetchMock);

    render(<MarkUnwatchedButton ratingKey="show-1" title="Rotation Show" />);

    await user.click(screen.getByRole("button", { name: "Mark Rotation Show as unwatched" }));

    expect(fetchMock).toHaveBeenCalledWith("/api/series/show-1/mark-unwatched", {
      method: "POST"
    });
    expect(await screen.findByText("Marked Rotation Show as unwatched.")).toBeInTheDocument();
  });

  it("shows an error state when the api call fails", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: vi.fn().mockResolvedValue({ error: "Plex is unavailable" })
    });

    vi.stubGlobal("fetch", fetchMock);

    render(<MarkUnwatchedButton ratingKey="show-1" title="Rotation Show" />);

    await user.click(screen.getByRole("button", { name: "Mark Rotation Show as unwatched" }));

    expect(await screen.findByText("Plex is unavailable")).toBeInTheDocument();
  });
});
