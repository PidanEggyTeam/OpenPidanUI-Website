import type { ReleasesPayload } from '#shared/releases'

export function useReleases() {
  const { data, error, status } = useFetch<ReleasesPayload>('/api/releases.json', { key: 'releases' })

  const payload = computed<ReleasesPayload>(
    () => data.value ?? { source: 'snapshot', fetchedAt: null, releases: [] },
  )

  const latest = computed(() => payload.value.releases.find(r => !r.prerelease) ?? payload.value.releases[0] ?? null)
  const others = computed(() => payload.value.releases.filter(r => r.tag !== latest.value?.tag))

  return { payload, latest, others, error, status }
}
