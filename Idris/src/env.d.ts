declare abstract class ServiceBinding {
  fetch(
    requestOrUrl: Request | string,
    requestInit?: RequestInit | Request
  ): Promise<Response>;
}

declare type Environment = {
  KV: KVNamespace;
  TOKEN: string;
  SHARD: DurableObjectNamespace;
  EVENT: ServiceBinding;
  PHISHERMAN_TOKEN: string;
};

declare type ShardStore = {
  current: number;
  shards: DurableObjectStub[];
  shardIds: string[];
};
