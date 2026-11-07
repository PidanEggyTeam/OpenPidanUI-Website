import type { ReleasesPayload } from '#shared/releases';
import fallback from '#shared/data/downloads.json';

export function useReleases() {
  const { data, error, status } = useFetch<ReleasesPayload>('/api/releases.json', {
    key: 'releases',
  });

  // 构建产物里 /api/releases.json 一定存在；这里仍留一份 downloads.json 兜底，
  // 避免运行时接口意外缺失时下载页变成空白。
  const payload = computed<ReleasesPayload>(
    () => data.value ?? (fallback as unknown as ReleasesPayload),
  );

  const latest = computed(
    () => payload.value.releases.find((r) => !r.prerelease) ?? payload.value.releases[0] ?? null,
  );
  const others = computed(() => payload.value.releases.filter((r) => r.tag !== latest.value?.tag));

  return { payload, latest, others, error, status };
}
